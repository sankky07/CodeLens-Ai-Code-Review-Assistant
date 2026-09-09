package com.sanket.backend.ai.service;

import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class FileScannerService {

    private static final Set<String> IGNORED_DIRECTORIES = Set.of(
            ".git",
            "node_modules",
            "target",
            "build",
            "dist",
            ".idea",
            ".vscode"
    );

    public List<File> scanSourceFiles(File directory){

        List<File> files = new ArrayList<>();

        scan(directory,files);

        return files;
    }

    private void scan(File file,List<File> files){

        if(file.isDirectory()){

            if(IGNORED_DIRECTORIES.contains(file.getName())){
                return;
            }

            File[] list=file.listFiles();

            if(list!=null){
                for(File f:list){
                    scan(f,files);
                }
            }

            return;
        }

        String name=file.getName().toLowerCase();

        if(name.endsWith(".java")
                ||name.endsWith(".js")
                ||name.endsWith(".ts")
                ||name.endsWith(".jsx")
                ||name.endsWith(".tsx")
                ||name.endsWith(".py")
                ||name.endsWith(".html")
                ||name.endsWith(".css")
                ||name.endsWith(".scss")
                ||name.endsWith(".xml")
                ||name.endsWith(".json")
                ||name.endsWith(".yml")
                ||name.endsWith(".yaml")
                ||name.endsWith(".sql")
                ||name.endsWith(".go")
                ||name.endsWith(".rs")
                ||name.endsWith(".cpp")
                ||name.endsWith(".c")
                ||name.endsWith(".h")
                ||name.endsWith(".cs")
                ||name.endsWith(".php")
                ||name.endsWith(".rb")){

            files.add(file);
        }

    }

}